package com.webcv.cvpdf.render;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
import com.webcv.exception.customexception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RenderHtmlToPdf {

    public byte[] renderHtmlToPdf(String html) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions().setHeadless(true)
                            .setHeadless(true)
                            .setArgs(List.of(
                                    "--no-sandbox",
                                    "--disable-setuid-sandbox",
                                    "--disable-dev-shm-usage"
                            ))
            );
            BrowserContext context = browser.newContext(
                    new Browser.NewContextOptions().setViewportSize(794, 1123)
            );
            Page page = context.newPage();
            page.setContent(html, new Page.SetContentOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

            Page.PdfOptions options = new Page.PdfOptions()
                    .setFormat("A4")
                    .setPrintBackground(true);

            byte[] pdf = page.pdf(options);
            context.close();
            browser.close();
            return pdf;
        } catch (Exception e) {
            log.error("PDF render failed", e);
            throw new BadRequestException("PDF render failed");
        }
    }

    public void renderHtmlToPdfToFile(String html, Path outputPath) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions().setHeadless(true)
            );
            BrowserContext context = browser.newContext(
                    new Browser.NewContextOptions().setViewportSize(794, 1123)
            );
            Page page = context.newPage();
            page.setContent(html, new Page.SetContentOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

            Page.PdfOptions options = new Page.PdfOptions()
                    .setFormat("A4")
                    .setPrintBackground(true)
                    .setPath(outputPath);

            // Playwright will write the PDF to disk; we intentionally ignore the returned bytes.
            page.pdf(options);

            context.close();
            browser.close();
        } catch (Exception e) {
            log.error("PDF render failed", e);
            throw new BadRequestException("PDF render failed");
        }
    }
}